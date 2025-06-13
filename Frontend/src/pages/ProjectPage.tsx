import React, { useState, type FormEvent } from 'react';
import { Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../controller/ProjectController';
import type { IProject } from '../models/ProjectModels';

/**
 * ProjectPage component provides a form to create a new project.
 *
 * Users can input project name and description, then submit to create
 * the project on the backend. It handles loading state and simple form validation.
 *
 * @component
 * @returns {JSX.Element} The project creation form page.
 */
export const ProjectPage: React.FC = () => {
  /** State for the project name input */
  const [projectName, setProjectName] = useState<string>("");

  /** State for the project description input */
  const [projectDescription, setProjectDescription] = useState<string>("");

  /** Loading state to disable inputs and button during submission */
  const [loading, setLoading] = useState<boolean>(false);

  /** React Router's navigation hook for programmatic navigation */
  const navigate = useNavigate();

  /**
   * Handles the form submission to create a new project.
   * - Validates input fields are not empty (trimmed).
   * - Calls createProject controller with the input data.
   * - Navigates to '/project-details' on success.
   * - Shows alerts on success or failure.
   *
   * @param event - Form event triggered on submit
   */
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!projectName.trim() || !projectDescription.trim()) {
      alert("Project name and description cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const newProjectData: Omit<IProject, 'id'> = {
        name: projectName.trim(),
        description: projectDescription.trim(),
      };

      await createProject(newProjectData);

      // Navigate to project details page after creation
      navigate('/project-details');

      // Optional alert, can be replaced with UI toast notification
      alert("Project created successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <form onSubmit={onSubmit}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold">Begin your Project Journey</h1>
              <p className="text-sm text-gray-500 mt-1">Kickstart by creating a new project</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 rounded-md p-3 flex items-center justify-between">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    className="bg-transparent w-full border-none focus:outline-none text-sm"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="E.g. New Website Launch"
                    disabled={loading}
                  />
                </div>
                <Eye className="h-5 w-5 text-gray-500" />
              </div>

              <div className="bg-gray-100 rounded-md p-3 flex items-start justify-between">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Project Description</label>
                  <textarea
                    rows={3}
                    className="bg-transparent w-full border-none focus:outline-none text-sm resize-none"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Briefly describe your project"
                    disabled={loading}
                  />
                </div>
                <FileText className="h-5 w-5 text-gray-500 mt-1" />
              </div>

              <button
                type="submit"
                className={`w-full text-white py-2 rounded-md transition-colors cursor-pointer ${
                  loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
                }`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
